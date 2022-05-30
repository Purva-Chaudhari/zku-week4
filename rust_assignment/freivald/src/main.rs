// TODO: Import necessary libraries. Check cargo.toml and the documentation of the libraries.
use ark_bls12_381::Fq as Fq;
use nalgebra::base::{DMatrix, DVector};
use ndarray::{Array1, Array2};
use rand::rngs::ThreadRng;
use rand::thread_rng;
use rand::Rng;

struct Freivald {
    x: Vec<Vec<Fq>>,// Array/Vec of Fq,
}

impl Freivald {
    // TODO: Create constructor for object
    fn new(array_size: usize) -> Self {
        // Generate random number  
        let mut rng = ark_std::test_rng();
        let r: Fq = rng.gen();
        for x in 0..array_size {
            x.push(pow(r,i));
          }
        //let r: Fq = rng.gen();
        // Populate vector with values r^i for i=0..matrix_size
        
        // Return freivald value with this vector as its x value
        
    }
    

    // TODO: Add proper types to input matrices. Remember matrices should hold Fq values
    fn verify (&self, matrix_a: &Vec<Vec<Fq>>, matrix_b: &Vec<Vec<Fq>>, supposed_ab: &Vec<Vec<Fq>>), rng: &mut R -> bool {
        assert!(check_matrix_dimensions(matrix_a, matrix_b, supposed_ab));
        // TODO: check if a * b * x == c * x. Check algorithm to make sure order of operations are
        let x = random_vector( rng, matrix_a.ncols());
    let cx = supposed_ab * x.clone();
    let abx = matrix_a * (matrix_b * x);

    abx == cx
        // correct
    }

    // utility function to not have to instantiate Freivalds if you just want to make one
    // verification.
    // TODO: Add types for arguments
    fn verify_once(matrix_a: &Vec<Vec<Fq>>, matrix_b: &Vec<Vec<Fq>>, supposed_ab: &Vec<Vec<Fq>>) -> bool {
        let freivald = Freivald::new(supposed_ab.nrows());
        freivald.verify(matrix_a, matrix_b, supposed_ab)
    }
}
// TODO: [Bonus] Modify code to increase your certainty that A * B == C by iterating over the protocol.
// Note that you need to generate new vectors for new iterations or you'll be recomputing same
// value over and over. No problem in changing data structures used by the algorithm (currently its a struct
// but that can change if you want to)

// You can either do a test on main or just remove main function and rename this file to lib.rs to remove the
// warning of not having a main implementation
fn main() {
    
}
// TODO: Add proper types to input matrices. Remember matrices should hold Fq values
pub fn check_matrix_dimensions(matrix_a: &Vec<Vec<Fq>>, matrix_b: &Vec<Vec<Fq>>, supposed_ab: &Vec<Vec<Fq>>) -> bool {
    // TODO: Check if dimensions of making matrix_a * matrix_b matches values in supposed_ab.
    // If it doesn't you know its not the correct result independently of matrix contents
    matrix_a.nrows() == matrix_b.ncols()
        && matrix_a.ncols() == matrix_b.nrows()
        && supposed_ab.nrows() == matrix_a.nrows()
        && supposed_ab.ncols() == matrix_b.ncols()
    
}

#[cfg(test)]
mod tests {
    // #[macro_use]
    use lazy_static::lazy_static;
    use rstest::rstest;

    use super::*;

    lazy_static! {
        static ref MATRIX_A: Vec<Vec<Fq>> = vec![[1,1], [1,1]];
        static ref MATRIX_A_DOT_A:Vec<Vec<Fq>> = vec![[2,2], [2,2]];
        static ref MATRIX_B: Vec<Vec<Fq>> = vec![[1,1], [1,1]];
        static ref MATRIX_B_DOT_B: Vec<Vec<Fq>> = vec![[2,2], [2,2]];
        static ref MATRIX_C: Vec<Vec<Fq>>/* Type of matrix. Values should be fq */ = /* arbitrary LARGE matrix (at least 200, 200)*/;
        static ref MATRIX_C_DOT_C: Vec<Vec<Fq>>/* Type of matrix. Values should be fq */ = /* Correct result of C * C */;
    }

    #[rstest]
    #[case(&MATRIX_A, &MATRIX_A, &MATRIX_A_DOT_A)]
    #[case(&MATRIX_B, &MATRIX_B, &MATRIX_B_DOT_B)]
    #[case(&MATRIX_C, &MATRIX_C, &MATRIX_C_DOT_C)]
    fn freivald_verify_success_test(
        #[case] matrix_a: &Vec<Vec<Fq>>/* Type of matrix. Values should be fq */,
        #[case] matrix_b: &Vec<Vec<Fq>>/* Type of matrix. Values should be fq */,
        #[case] supposed_ab: &Vec<Vec<Fq>>/* Type of matrix. Values should be fq */,
    ) {
        let freivald = Freivald::new(supposed_ab.nrows());
        assert!(freivald.verify(matrix_a, matrix_b, supposed_ab));
    }

    // #[rstest]
    // #[case(&MATRIX_A, &MATRIX_B, &MATRIX_A_DOT_A)]
    // #[case(&MATRIX_B, &MATRIX_A, &MATRIX_B_DOT_B)]
    // #[case(&MATRIX_C, &MATRIX_B, &MATRIX_C_DOT_C)]
    // fn freivald_verify_fail_test(
    //     #[case] a: &Vec<Vec<Fq>>/* Type of matrix. Values should be fq */,
    //     #[case] b: &Vec<Vec<Fq>>/* Type of matrix. Values should be fq */,
    //     #[case] c: &Vec<Vec<Fq>>/* Type of matrix. Values should be fq */,
    // ) {
    //     let freivald = Freivald::new(c.nrows());
    //     assert!(!freivald.verify(a, b, c));
    // }
}
